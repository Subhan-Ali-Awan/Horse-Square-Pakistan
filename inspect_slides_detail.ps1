Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead('CampusConnect_FYP_Internal_Presentation.pptx')
$slides = $zip.Entries | Where-Object { $_.FullName -like 'ppt/slides/slide*.xml' }

foreach ($s in $slides) {
    $num = [int]($s.Name -replace '\D')
    $stream = $s.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    
    # Get all text paragraphs
    $doc = New-Object System.Xml.XmlDocument
    $doc.LoadXml($xml)
    $ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
    $ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
    $ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    
    $pNodes = $doc.SelectNodes("//a:p", $ns)
    $texts = @()
    foreach ($p in $pNodes) {
        $t = ($p.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText }) -join ""
        if ($t.Trim()) {
            $texts += $t.Trim()
        }
    }
    
    Write-Output "================ SLIDE $num ================"
    $texts | ForEach-Object { Write-Output " - $_" }
}
$zip.Dispose()
