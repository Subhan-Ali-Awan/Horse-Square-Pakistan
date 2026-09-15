Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceFile = "CampusConnect_FYP_Internal_Presentation.pptx"
$tempDir = "temp_ppt_exact_clean"
$targetFile = "HorseSquare_Pakistan_FYP_Internal_Presentation.pptx"

if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path $targetFile) {
    Remove-Item -Path $targetFile -Force -ErrorAction SilentlyContinue
}

[System.IO.Compression.ZipFile]::ExtractToDirectory($sourceFile, $tempDir)
Write-Output "Extracted baseline template to $tempDir."

$jsonContent = [System.IO.File]::ReadAllText("clean_text_map.json", [System.Text.Encoding]::UTF8)
$map = $jsonContent | ConvertFrom-Json

$slideFiles = Get-ChildItem -Path "$tempDir\ppt\slides" -Filter "slide*.xml"

foreach ($file in $slideFiles) {
    $xmlDoc = New-Object System.Xml.XmlDocument
    $xmlDoc.PreserveWhitespace = $true
    $xmlDoc.Load($file.FullName)
    
    $ns = New-Object System.Xml.XmlNamespaceManager($xmlDoc.NameTable)
    $ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    $ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
    
    $textNodes = $xmlDoc.SelectNodes("//a:t", $ns)
    foreach ($node in $textNodes) {
        $cur = $node.InnerText
        foreach ($prop in $map.PSObject.Properties) {
            $k = $prop.Name
            $v = $prop.Value
            if ($cur.Contains($k)) {
                $cur = $cur.Replace($k, $v)
            }
        }
        $node.InnerText = $cur
    }
    
    # Save cleanly with UTF-8
    $xmlDoc.Save($file.FullName)
    Write-Output "Cleanly updated $($file.Name)"
}

# Zip cleanly into target PPTX
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $targetFile)
Write-Output "Successfully built $targetFile"

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "generate_clean_presentation.ps1", "inspect_slides_detail.ps1", "slide_details.txt", "slide_details_utf8.txt" -Force -ErrorAction SilentlyContinue
Write-Output "Cleanup complete."
