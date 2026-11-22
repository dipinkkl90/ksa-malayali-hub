$src = "C:\Users\Dipin\.gemini\antigravity\scratch\Ksa_Jeddah_keralafoods\Ksa_Jeddah_keralafoods-main"
$dst = "C:\Users\Dipin\.gemini\antigravity\scratch\Ksa_Jeddah_keralafoods\Ksa_Jeddah_keralafoods-completed.zip"
if (Test-Path $dst) { Remove-Item $dst -Force }
Get-ChildItem -Path $src -Exclude '.git' | Compress-Archive -DestinationPath $dst -Force
Write-Host "Created $dst with size: $((Get-Item $dst).Length)"
