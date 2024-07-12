# Cliente OPC UA y Envío a Orion Contex Broker de Fiware

Este proyecto consiste en un cliente desarrollado en Node.js que se conecta a un servidor OPC UA para leer variables específicas y enviarlas a un Orion Context Broker de Fiware. Es útil para integrar datos provenientes de sistemas basados en OPC UA con aplicaciones que consumen datos a través de Fiware Context Broker.

## Descripción
El cliente OPC UA establece una conexión con el servidor OPC UA especificado, lee las variables definidas en el archivo de configuración y publica los valores de estas variables en OCB.

## Requisitos
Antes de ejecutar el cliente, asegúrate de tener instalado Node.js en tu sistema. Puedes descargarlo desde nodejs.org.

## Configuración
Clonar el Repositorio:

bash
Copiar código
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
Instalar Dependencias:

bash
Copiar código
npm install
Configurar Variables de Entorno:

Crea un archivo .env en el directorio raíz del proyecto basado en el archivo .env.example. Puedes copiar el archivo .env.example y modificar los valores según sea necesario.

bash
Copiar código
cp .env.example .env
Edita el archivo .env y proporciona los valores correctos para las URLs del servidor OPC UA y del OCB.

Ejecutar el Cliente:

Para ejecutar el cliente OPC UA y comenzar a enviar datos a OCB, utiliza el siguiente comando:

bash
Copiar código
node client-opcua-ocb.js