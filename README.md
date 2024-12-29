# ForoHub - Aplicación de Foro con Spring Boot

## Requisitos Previos

- Java JDK 17 o superior
- Maven 3.6.3 o superior
- Docker y Docker Compose
- IntelliJ IDEA (Community o Ultimate)

## Configuración del Proyecto en IntelliJ IDEA

1. Clonar el repositorio:
```bash
git clone <https://github.com/Angelsoul35/ForoHub>
cd forohub
```

2. Abrir el proyecto en IntelliJ IDEA:
   - File -> Open -> Seleccionar la carpeta del proyecto
   - Esperar a que Maven descargue las dependencias

3. Configurar el JDK:
   - File -> Project Structure -> Project
   - Seleccionar JDK 17 o superior

## Ejecutar la Aplicación

### Opción 1: Con Docker Compose (Recomendado)

1. Iniciar los contenedores:
```bash
docker-compose up -d
```

2. La aplicación estará disponible en:
   - Backend: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Base de datos PostgreSQL: localhost:5432

### Opción 2: Desarrollo Local

1. Iniciar solo la base de datos:
```bash
docker-compose up -d postgres
```

2. Ejecutar la aplicación desde IntelliJ IDEA:
   - Abrir la clase `ForoHubApplication.java`
   - Hacer clic en el botón verde ▶️ junto al método main
   - O usar la configuración de ejecución "Spring Boot Application"

## Estructura del Proyecto

```
src/main/java/com/example/forohub/
├── config/           # Configuraciones de Spring
├── controller/       # Controladores REST
├── dto/             # Objetos de transferencia de datos
├── entity/          # Entidades JPA
├── repository/      # Repositorios JPA
├── security/        # Configuración de seguridad y JWT
├── service/         # Lógica de negocio
└── ForoHubApplication.java

src/main/resources/
└── application.yml  # Configuración de la aplicación
```

## Endpoints API

La documentación completa de la API está disponible en Swagger UI:
http://localhost:8080/swagger-ui.html

### Principales Endpoints

- Auth:
  - POST /api/auth/register
  - POST /api/auth/login

- Cursos:
  - GET /api/cursos
  - POST /api/cursos
  - GET /api/cursos/{id}

- Tópicos:
  - GET /api/topicos
  - POST /api/topicos
  - GET /api/topicos/{id}

## Base de Datos

- URL: jdbc:postgresql://localhost:5432/forohub
- Usuario: admin
- Contraseña: admin123

## Solución de Problemas

1. Error de conexión a la base de datos:
   - Verificar que el contenedor de PostgreSQL esté ejecutándose
   - Comprobar las credenciales en application.yml

2. Error de compilación:
   - Verificar la versión de Java (17)
   - Actualizar las dependencias de Maven: `mvn clean install`

3. Error de puertos en uso:
   - Verificar que los puertos 8080 y 5432 estén disponibles
   - Modificar los puertos en docker-compose.yml si es necesario