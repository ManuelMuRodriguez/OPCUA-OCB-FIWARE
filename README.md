# Cliente OPC UA y Envío a Orion Contex Broker de Fiware

Este proyecto consiste en un cliente desarrollado en Node.js que se conecta a un servidor OPC UA para leer variables específicas y enviarlas a un Orion Context Broker de Fiware. Es útil para integrar datos provenientes de sistemas basados en OPC UA con aplicaciones que consumen datos a través de Fiware Context Broker.

## Descripción
El cliente OPC UA establece una conexión con el servidor OPC UA especificado, lee las variables definidas en el archivo de configuración y publica los valores de estas variables en OCB.

## Requisitos
Antes de ejecutar el cliente, asegúrate de tener instalado Node.js en tu sistema. Puedes descargarlo desde nodejs.org.

## Configuración
Clonar el Repositorio:

- Copiar código
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

- Instalar Dependencias:

Copiar código
npm install
Configurar Variables de Entorno:

Crea un archivo .env en el directorio raíz del proyecto basado en el archivo .env.example. Puedes copiar el archivo .env.example y modificar los valores según sea necesario.

- Copiar código
cp .env.example .env
Edita el archivo .env y proporciona los valores correctos para las URLs del servidor OPC UA y del OCB.

- Ejecutar el Cliente:

Para ejecutar el cliente OPC UA y comenzar a enviar datos a OCB, utiliza el siguiente comando:

- Copiar código
node client-opcua-ocb.js


## Ejecutar con docker

### Ejecutar Docker Compose

Para ejecutar tu aplicación con Docker Compose, abre una terminal, navega al directorio que contiene tu archivo docker-compose.yml y ejecuta el siguiente comando:

- Copiar código
docker-compose up --build

Tu archivo .env debe contener las variables de entorno necesarias:

OPCUA_ENDPOINT_URL=opc.tcp://example.com:49320
ORION_BASE_URL=http://example:1026/v2
FIWARE_SERVICE=example
FIWARE_SERVICE_PATH=/example
ENTITYID=example
MAPPINGS_FILE_PATH=mappings.json

Este comando construirá la imagen Docker definida en tu Dockerfile, creará y arrancará el servicio definido en tu docker-compose.yml.