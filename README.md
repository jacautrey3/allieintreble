# Allie in Treble — allieintreble.com

Static business website for singing lessons, deployed to AWS.

## Architecture

```
GitHub → GitHub Actions → S3 (static files)
                       ↘ CloudFront (CDN + HTTPS)
                          ↕ Route 53 (allieintreble.com)

Inquiry form → API Gateway → Lambda (Python) → SES → allisontaylor@gmail.com
```

## Project Structure

```
.
├── src/                        # Static website
│   ├── index.html              # Home page
│   ├── inquiry.html            # Inquiry / booking form
│   ├── css/styles.css
│   └── js/main.js
├── lambda/
│   └── index.py                # Form handler (SES email)
├── terraform/                  # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── .github/workflows/
    └── deploy.yml              # Auto-deploy on push to main
```

---

## One-Time Setup

### 1. Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) configured with an IAM user that has sufficient permissions
- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.6
- A GitHub account with this repo created

### 2. Deploy Infrastructure with Terraform

```bash
cd terraform
terraform init
terraform apply
```

Terraform will output several values when it finishes — **save them**.

| Output | What to do with it |
|--------|-------------------|
| `route53_nameservers` | Copy all 4 into Squarespace's custom nameserver settings (see below) |
| `github_actions_role_arn` | Add as `AWS_ROLE_ARN` GitHub secret |
| `api_gateway_url` | Add as `API_GATEWAY_URL` GitHub secret |
| `s3_bucket_name` | Add as `S3_BUCKET_NAME` GitHub secret |
| `cloudfront_distribution_id` | Add as `CLOUDFRONT_DISTRIBUTION_ID` GitHub secret |

#### Pointing Squarespace to Route 53

The domain is registered through Squarespace but DNS is managed by Route 53. After `terraform apply` outputs the nameservers:

1. Log in to Squarespace → **Domains**
2. Click **allieintreble.com** → **DNS Settings**
3. Scroll to **Nameservers** → select **Use custom nameservers**
4. Replace the existing nameservers with the 4 values from Terraform (e.g. `ns-123.awsdns-45.com`)
5. Save — propagation typically takes 15 minutes to a few hours

> **Note:** ACM certificate validation can take 5–30 minutes after the nameservers propagate.

### 3. Verify your SES email

AWS will send a verification email to `allievtaylor@gmail.com`. Click the link inside it. **The inquiry form will not work until this step is complete.**

> SES accounts start in *sandbox mode*, which only allows sending to verified addresses. To go live, [request production access](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) in the AWS console (takes 24–48 hours and is free).

### 4. Add GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name | Value |
|-------------|-------|
| `AWS_ROLE_ARN` | From Terraform output `github_actions_role_arn` |
| `S3_BUCKET_NAME` | From Terraform output `s3_bucket_name` |
| `CLOUDFRONT_DISTRIBUTION_ID` | From Terraform output `cloudfront_distribution_id` |
| `API_GATEWAY_URL` | From Terraform output `api_gateway_url` |

No AWS access keys are stored — GitHub Actions uses OIDC to assume the IAM role directly.

### 5. Push to main

```bash
git push origin main
```

GitHub Actions will sync `src/` to S3, inject the API URL, and invalidate the CloudFront cache. Your site will be live at **https://allieintreble.com**.

---

## Ongoing Development

| Task | Command |
|------|---------|
| Preview locally | Open `src/index.html` in a browser (form won't submit without the API) |
| Deploy changes | `git push origin main` — GitHub Actions handles the rest |
| Update infrastructure | `cd terraform && terraform apply` |
| View Lambda logs | AWS Console → CloudWatch → Log groups → `/aws/lambda/allieintreble-inquiry` |

---

## IAM Permissions Needed

The AWS IAM user used for GitHub Actions only needs:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:DeleteObject",
    "s3:ListBucket",
    "cloudfront:CreateInvalidation"
  ],
  "Resource": "*"
}
```

The IAM user used for `terraform apply` needs broader permissions (S3, CloudFront, Route53, ACM, Lambda, API Gateway, IAM, SES, CloudWatch).

---

## Customising the Site

- **Bio / content:** Edit `src/index.html` — look for placeholder text in brackets `[...]`
- **Photo:** Replace the placeholder div in `src/index.html` with an `<img>` tag
- **Testimonials:** Update the three testimonial cards in `src/index.html`
- **Colours / fonts:** Edit `src/css/styles.css` — CSS custom properties are at the top
- **Notification email:** Change `notification_email` in `terraform/variables.tf` and re-run `terraform apply`
