### Inicializacion de la base de datos y configuracion de docker + postgresql
con el objetivo de empezar con una infraestructura fuerte y que funcione uno de los criterios de aceptacion0(la ejecucion por docker con un comando)

### uso del puerto 5433

se utiliza el puerto 5433 para facilitacion de uso, ocurrió  un caso donde no permitía usar el puerto por defecto por que ya estaba usado, en ese caso por facilidad, pruebas y control de tiempo se utilizó el puerto modificado 5433.

### uso de las tablas en postgresql

- rw_users : se utiliza para representar los usuarios de Riwi

- rw_channels : representa los canales o conversaciones

- rw_channel_members : tabla muchos a muchos, ya que un usuario Riwi puede tener muchas conversaciones

- rw_messages : esto representa los estados de los mensajes 

- rw_messages_read : representa el estado de lectura del mensaje

- rw_refresh_tokens : representa la validacion de accesos para no subir texto plano y evitar los problemas de seguridad

### uso de los indexes

se utilizan indexes para manejar el requisito explícito del assessment de tener al menos un índice único parcial.

### seed.json

la carpeta seed sirve como documentacion para la forma de normalizacion 3

# seed.sql

esta carpeta funciona como un mock data o banco de prueba, donde insertamos data de prueba para cada cosa desde la base de datos


### functions

- user_has_channel : permite comprobar que un usuario pueda tener el acceso al chat

- 002_send_message : permite validar y crear mensajes directamente


