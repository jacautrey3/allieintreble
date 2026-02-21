output "github_actions_role_arn" {
  description = "Add this as the AWS_ROLE_ARN GitHub secret — no access keys needed"
  value       = aws_iam_role.github_actions.arn
}

output "s3_bucket_name" {
  description = "S3 bucket that hosts the static site"
  value       = aws_s3_bucket.website.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain" {
  description = "CloudFront domain name (use for DNS verification before cert is active)"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "api_gateway_url" {
  description = "Full URL for the inquiry endpoint — add this as the API_GATEWAY_URL GitHub secret"
  value       = "${aws_api_gateway_stage.prod.invoke_url}/inquiry"
}

output "route53_nameservers" {
  description = "Point your domain registrar to these nameservers"
  value       = aws_route53_zone.main.name_servers
}

output "ses_verification_required" {
  description = "Check your inbox for an SES verification email before the form will work"
  value       = "A verification email was sent to ${var.notification_email} — click the link to enable sending."
}
