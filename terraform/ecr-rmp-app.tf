terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

resource "aws_ecr_repository" "sejal_docker_image" {
  name = "sejal_docker_image"
}