from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    aws_endpoint_url: str
    aws_s3_bucket: str
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
