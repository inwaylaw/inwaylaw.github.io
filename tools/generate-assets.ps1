param(
  [string]$OutputDir = (Join-Path (Split-Path $PSScriptRoot -Parent) 'assets')
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

function New-Brush {
  param([int]$A, [int]$R, [int]$G, [int]$B)
  return New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($A, $R, $G, $B))
}

function New-Pen {
  param([int]$A, [int]$R, [int]$G, [int]$B, [float]$Width = 1)
  return New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($A, $R, $G, $B), $Width)
}

function New-RoundedRectPath {
  param(
    [System.Drawing.RectangleF]$Rect,
    [float]$Radius
  )

  $diameter = $Radius * 2
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-Asset {
  param(
    [string]$Name,
    [int]$Width,
    [int]$Height,
    [int]$Seed,
    [string]$Mode
  )

  $random = [System.Random]::new($Seed)
  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::FromArgb(255, 247, 238, 219))

  $bgRect = [System.Drawing.Rectangle]::new(0, 0, $Width, $Height)
  $bgBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $bgRect,
    [System.Drawing.Color]::FromArgb(255, 247, 238, 219),
    [System.Drawing.Color]::FromArgb(255, 238, 224, 193),
    35
  )
  $graphics.FillRectangle($bgBrush, $bgRect)

  for ($i = 0; $i -lt 70; $i++) {
    $x = $random.NextDouble() * $Width
    $y = $random.NextDouble() * $Height
    $s = 120 + $random.NextDouble() * 420
    $a = 7 + $random.Next(20)
    if (($i % 3) -eq 0) {
      $brush = New-Brush $a 217 154 61
    } elseif (($i % 3) -eq 1) {
      $brush = New-Brush $a 199 125 107
    } else {
      $brush = New-Brush $a 159 198 189
    }
    $graphics.FillEllipse($brush, [float]($x - $s / 2), [float]($y - $s / 2), [float]$s, [float]$s)
    $brush.Dispose()
  }

  if ($Mode -eq 'portrait') {
    $paneBrush = New-Brush 86 255 248 226
    $edgePen = New-Pen 82 217 154 61 2
    $pane = [System.Drawing.RectangleF]::new($Width * 0.24, $Height * 0.12, $Width * 0.52, $Height * 0.76)
    $panePath = New-RoundedRectPath -Rect $pane -Radius 38
    $graphics.FillPath($paneBrush, $panePath)
    $graphics.DrawPath($edgePen, $panePath)
    $panePath.Dispose()
    $paneBrush.Dispose()
    $edgePen.Dispose()

    $headBrush = New-Brush 112 217 154 61
    $bodyBrush = New-Brush 86 66 107 82
    $graphics.FillEllipse($headBrush, [float]($Width * 0.39), [float]($Height * 0.25), [float]($Width * 0.22), [float]($Width * 0.22))
    $graphics.FillEllipse($bodyBrush, [float]($Width * 0.28), [float]($Height * 0.46), [float]($Width * 0.44), [float]($Height * 0.38))
    $headBrush.Dispose()
    $bodyBrush.Dispose()
  } else {
    for ($i = 0; $i -lt 9; $i++) {
      $points = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new([float]($random.NextDouble() * $Width), [float]($random.NextDouble() * $Height)),
        [System.Drawing.PointF]::new([float]($random.NextDouble() * $Width), [float]($random.NextDouble() * $Height)),
        [System.Drawing.PointF]::new([float]($random.NextDouble() * $Width), [float]($random.NextDouble() * $Height)),
        [System.Drawing.PointF]::new([float]($random.NextDouble() * $Width), [float]($random.NextDouble() * $Height))
      )
      if (($i % 2) -eq 0) {
        $brush = New-Brush (18 + $random.Next(34)) 217 154 61
      } else {
        $brush = New-Brush (14 + $random.Next(30)) 199 125 107
      }
      $graphics.FillPolygon($brush, $points)
      $brush.Dispose()
    }
  }

  for ($i = 0; $i -lt 160; $i++) {
    $x1 = $random.NextDouble() * $Width
    $y1 = $random.NextDouble() * $Height
    $x2 = $x1 + ($random.NextDouble() - 0.5) * 260
    $y2 = $y1 + ($random.NextDouble() - 0.5) * 260
    if (($i % 3) -eq 0) {
      $pen = New-Pen (18 + $random.Next(34)) 66 107 82 (0.6 + $random.NextDouble() * 1)
    } elseif (($i % 3) -eq 1) {
      $pen = New-Pen (18 + $random.Next(34)) 159 198 189 (0.6 + $random.NextDouble() * 1)
    } else {
      $pen = New-Pen (18 + $random.Next(34)) 148 100 59 (0.6 + $random.NextDouble() * 1)
    }
    $graphics.DrawLine($pen, [float]$x1, [float]$y1, [float]$x2, [float]$y2)
    $pen.Dispose()
  }

  for ($i = 0; $i -lt 280; $i++) {
    $x = $random.NextDouble() * $Width
    $y = $random.NextDouble() * $Height
    $r = 1 + $random.NextDouble() * 4
    $brush = New-Brush (44 + $random.Next(66)) 255 248 226
    $graphics.FillEllipse($brush, [float]$x, [float]$y, [float]$r, [float]$r)
    $brush.Dispose()
  }

  $vignette = [System.Drawing.Drawing2D.PathGradientBrush]::new([System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(0, 0),
    [System.Drawing.PointF]::new($Width, 0),
    [System.Drawing.PointF]::new($Width, $Height),
    [System.Drawing.PointF]::new(0, $Height)
  ))
  $vignette.CenterColor = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
  $vignette.SurroundColors = [System.Drawing.Color[]]@(
    [System.Drawing.Color]::FromArgb(42, 80, 60, 36),
    [System.Drawing.Color]::FromArgb(42, 80, 60, 36),
    [System.Drawing.Color]::FromArgb(42, 80, 60, 36),
    [System.Drawing.Color]::FromArgb(42, 80, 60, 36)
  )
  $graphics.FillRectangle($vignette, $bgRect)

  $path = Join-Path $OutputDir $Name
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $vignette.Dispose()
  $bgBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

Draw-Asset -Name 'hero-signal.png' -Width 1400 -Height 1000 -Seed 1601 -Mode 'field'
Draw-Asset -Name 'case-edge-ai.png' -Width 1200 -Height 900 -Seed 2408 -Mode 'field'
Draw-Asset -Name 'case-agent-runtime.png' -Width 1000 -Height 1200 -Seed 3317 -Mode 'field'
Draw-Asset -Name 'portrait-abstract.png' -Width 900 -Height 1100 -Seed 4129 -Mode 'portrait'

Write-Host "Generated assets in $OutputDir"
