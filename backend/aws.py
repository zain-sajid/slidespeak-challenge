import boto3
from config import settings


s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region,
    endpoint_url=settings.aws_endpoint_url,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)