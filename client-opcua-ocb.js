const opcua = require("node-opcua");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

// Leer los mappings desde el archivo JSON usando la ruta del archivo de mapeo desde .env
const mappingsFilePath = path.join(__dirname, process.env.MAPPINGS_FILE_PATH);
const mappings = JSON.parse(fs.readFileSync(mappingsFilePath, 'utf8'));

// URL del servidor OPC UA y del Orion Context Broker desde el archivo .env
const endpointUrl = process.env.OPCUA_ENDPOINT_URL;
const orionBaseUrl = process.env.ORION_BASE_URL;
const entityId = process.env.ENTITYID;
const orionUrl = `${orionBaseUrl}/entities/${entityId}/attrs`;

// Fiware-Service y Fiware-ServicePath desde el archivo .env
const fiwareService = process.env.FIWARE_SERVICE;
const fiwareServicePath = process.env.FIWARE_SERVICE_PATH;

// Ruta del archivo de log
const logFilePath = path.join(__dirname, 'logs', 'opcua-client.log');

// Función para escribir logs en un archivo
function writeLog(level, message) {
    const logMessage = `${new Date().toISOString()} - ${level.toUpperCase()} - ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
}

async function main() {
    try {
        // Crear el cliente OPC UA
        const client = opcua.OPCUAClient.create({ endpointMustExist: false });

        // Conectar al servidor OPC UA
        await client.connect(endpointUrl);
        console.log("Cliente conectado al servidor OPC UA");
        writeLog("info", "Cliente conectado al servidor OPC UA");

        // Crear una sesión
        const session = await client.createSession();
        console.log("Sesión creada");
        writeLog("info", "Sesión creada");

        // Leer las variables según los mapeos y enviar a Orion Context Broker
        setInterval(async () => {
            try {
                const timestamp = new Date().toISOString();
                const attributes = {};

                for (const mapping of mappings) {
                    const dataValue = await session.read({ nodeId: mapping.opcua_id, attributeId: opcua.AttributeIds.Value });
                    attributes[mapping.ocb_id] = {
                        type: "Float",
                        value: dataValue.value.value,
                        metadata: {
                            timestamp: {
                                type: "DateTime",
                                value: timestamp
                            }
                        }
                    };
                }

                // Verificar si la entidad existe
                try {
                    await axios.get(`${orionBaseUrl}/entities/${entityId}`, {
                        headers: {
                            'Fiware-Service': fiwareService,
                            'Fiware-ServicePath': fiwareServicePath
                        }
                    });
                    writeLog("info", "La entidad existe, actualizando...");
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        // Si la entidad no existe, crearla
                        writeLog("info", "La entidad no existe, creando...");
                        await axios.post(`${orionBaseUrl}/entities`, {
                            id: entityId,
                            type: "OPCUA",
                            ...attributes
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Fiware-Service': fiwareService,
                                'Fiware-ServicePath': fiwareServicePath
                            }
                        });
                        writeLog("info", "Entidad creada");
                        return; // Salir de la función porque ya hemos hecho la creación
                    } else {
                        throw error;
                    }
                }

                // Configuración de los headers
                const headers = {
                    'Content-Type': 'application/json',
                    'Fiware-Service': fiwareService,
                    'Fiware-ServicePath': fiwareServicePath
                };

                // Enviar datos a Orion Context Broker
                await axios.post(orionUrl, attributes, { headers });
                writeLog("info", "Datos enviados a Orion Context Broker");

            } catch (err) {
                console.log("Error al leer variables o enviar datos:", err.message);
                writeLog("error", "Error al leer variables o enviar datos: " + err.message);
                if (err.response) {
                    console.error("Detalles del error:", err.response.data);
                    writeLog("error", "Detalles del error: " + JSON.stringify(err.response.data));
                }
            }
        }, 30000); // Intervalo de lectura cada 30 segundos

    } catch (err) {
        console.log("Error al conectar con el servidor OPC UA:", err.message);
        writeLog("error", "Error al conectar con el servidor OPC UA: " + err.message);
    }
}

main();
