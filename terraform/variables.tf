variable "domain_name" {
  description = "Root domain name (e.g. allieintreble.com)"
  type        = string
  default     = "allieintreble.com"
}

variable "aws_region" {
  description = "Primary AWS region for Lambda and API Gateway"
  type        = string
  default     = "us-west-1"
}

variable "ses_region" {
  description = "Region for SES (us-west-1 does not support SES; us-east-1 is used instead)"
  type        = string
  default     = "us-east-1"
}

variable "github_repo" {
  description = "GitHub repo in owner/repo format (e.g. jautrey/allieintreble) — scopes the OIDC trust policy"
  type        = string
}

variable "notification_email" {
  description = "Email address that receives inquiry notifications (must be SES-verified)"
  type        = string
  default     = "allievtaylor@gmail.com"
}
