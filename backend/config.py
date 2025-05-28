from pydantic_settings import BaseSettings, SettingsConfigDict
import boto3


class Settings(BaseSettings):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    aws_endpoint_url: str
    aws_s3_bucket: str
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region,
    endpoint_url=settings.aws_endpoint_url,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)
