variable "domain_name" {
  description = "Root domain name (e.g. allieintreble.com)"
  type        = string
  default     = "allieintreble.com"
}

variable "aws_region" {
  description = "Primary AWS region for Lambda and API Gateway"
  type        = string
  default     = "us-east-1"
}

variable "notification_email" {
  description = "Email address that receives inquiry notifications (must be SES-verified)"
  type        = string
  default     = "allisontaylor@gmail.com"
}
