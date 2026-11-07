# WIPPEL Backend - User Credentials Checker
# This script displays all available user accounts and their credentials

Write-Host "=============================================="
Write-Host "WIPPEL Backend - User Accounts" -ForegroundColor Cyan
Write-Host "=============================================="
Write-Host ""

# Run the Go script
go run list-users.go
