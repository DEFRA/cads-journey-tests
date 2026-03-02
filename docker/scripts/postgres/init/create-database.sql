DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'cads-data-service'
   ) THEN
      CREATE DATABASE "cads-data-service";
   END IF;
END
$$;