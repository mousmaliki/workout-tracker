Add-Type -AssemblyName System.Drawing

$iconDirectory = Join-Path $PSScriptRoot '..\icons'
foreach ($size in @(192, 512)) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.ScaleTransform($size / 192.0, $size / 192.0)
    $graphics.Clear([System.Drawing.Color]::FromArgb(121, 184, 255))

    $dark = [System.Drawing.Color]::FromArgb(23, 59, 99)
    $bar = [System.Drawing.Pen]::new($dark, 15)
    $bar.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $bar.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $plate = [System.Drawing.Pen]::new($dark, 24)
    $plate.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $plate.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $innerPlate = [System.Drawing.Pen]::new($dark, 16)
    $innerPlate.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $innerPlate.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $graphics.DrawLine($bar, 60, 96, 132, 96)
    $graphics.DrawLine($plate, 43, 63, 43, 129)
    $graphics.DrawLine($innerPlate, 65, 76, 65, 116)
    $graphics.DrawLine($innerPlate, 127, 76, 127, 116)
    $graphics.DrawLine($plate, 149, 63, 149, 129)

    $path = Join-Path $iconDirectory "app-icon-$size.png"
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $innerPlate.Dispose(); $plate.Dispose(); $bar.Dispose()
    $graphics.Dispose(); $bitmap.Dispose()
}
