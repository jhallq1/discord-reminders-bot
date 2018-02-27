CREATE SEQUENCE public.id_seq
    INCREMENT 1
    START 20
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.id_seq
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('id_seq'::regclass),
    username varchar COLLATE pg_catalog."default" NOT NULL,
    username_discriminator varchar COLLATE pg_catalog."default" NOT NULL,
    timezone text COLLATE pg_catalog."default" NOT NULL,
    job_ids text[] COLLATE pg_catalog."default",
    CONSTRAINT user_timezones_pkey PRIMARY KEY (id),
    CONSTRAINT username_discriminator UNIQUE (username_discriminator)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

ALTER TABLE public.users ADD COLUMN job_ids text[];
