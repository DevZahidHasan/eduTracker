  Please run these three commands one by one in your terminal:

   1. Delete the existing database:

   1     "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "DROP DATABASE IF EXISTS edutracker WITH (FORCE);"

   2. Create a fresh, empty database:

   1     "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE edutracker;"

   3. Restore the backup into the empty database:

   1     "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d edutracker -f
     "D:\backup\without-parent\edutracker_backup_2026-05-29T19-03-40-475Z.sql"