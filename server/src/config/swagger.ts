import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      version: '1.0.0',
      title: 'swapi-project API',
      description: 'swapi-project API Information',
      contact: {
        name: 'sochacki111',
        url: 'https://github.com/sochacki111'
      },
      servers: ['http://localhost:8080']
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['**/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
