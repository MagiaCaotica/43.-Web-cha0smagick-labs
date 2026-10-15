/**
 * deepdive/pixellibre.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/pixellibre.html.
 *
 * El tema no es "editor de imagenes" en abstracto, sino el motivo por el que
 * la gente busca uno: alguien que no quiere registrarse y no quiere subir las
 * fotos a un servidor. Ese miedo concreto es la keyword de entrada y el eje
 * del texto.
 */

export const PIXELLIBRE = {
  targets: [
    'free image editor online without signup',
    'remove background from a photo with ai',
    'resize image for instagram post size',
    'convert png to jpg online free',
    'edit photos offline in your browser',
    'image editor that keeps files on your device',
    'webp converter online free',
    'crop and rotate images online free',
    'add text to a photo online free',
    'image editor with no watermark and no limits'
  ],
  sections: [
    {
      h2: 'A free image editor online without signup',
      paras: [
        'PixelLibre is an image editor that runs entirely inside a browser tab. You open the page, drop a file in or paste one with the keyboard, and the editing happens on your own machine. There is no account, no email, no trial timer and no watermark on the result.',
        'That combination sounds ordinary until you compare it with the rest of the category. Most editors described as free are free in the sense that the first four exports are free. The ones that are genuinely free with no signup are usually restricted to one or two operations. The table below is the full set of what is actually there.'
      ],
      table: {
        caption: 'What the editor covers, end to end',
        head: ['Operation', 'What it does', 'Notes'],
        rows: [
          ['Resize', 'Sets width and height, with presets', 'Lock aspect ratio available'],
          ['Crop', 'Select an area and cut the rest', 'Or keep the full image'],
          ['Rotate and mirror', '90 degree steps, 180, horizontal, vertical', 'Non-destructive until you export'],
          ['Filters', 'Black and white, sepia, negative, tone', 'Filters stack with each other'],
          ['Adjustments', 'Brightness, contrast, saturation, blur, vignette, pixelate', 'Each on a percentage scale'],
          ['Text', 'Font, size, fill, stroke, weight, italics', 'Click an existing text to edit it'],
          ['Frame', 'Thickness and colour', 'Straightforward'],
          ['Rounded corners', 'Corner radius', 'Useful for icons and avatars'],
          ['Remove background', 'AI segmentation, runs locally', 'Model downloads once, then cached'],
          ['Export', 'PNG, JPG or WebP with quality control', 'PNG keeps transparency']
        ]
      }
    },
    {
      h2: 'Edit photos offline in your browser',
      paras: [
        'The processing is local, which has two consequences that matter more than the feature list. First, the editor keeps working without a connection once the page is loaded. Second, and far more important, your image never leaves your device — not because the company promises it will delete it, but because the code never sends it anywhere.',
        'This is the reason background removal is the part worth explaining. The AI model that cuts a subject out of its background is about ninety megabytes. It downloads once from the site, is cached by the browser, and from that moment on the segmentation runs locally — including with no network at all. The model is loaded once rather than downloaded per photo, which is why the feature feels instant rather than like an upload.'
      ],
      h3s: [
        {
          h3: 'What local processing means for the model itself',
          text: 'A segmentation model does not understand your photo the way you do. It looks for edges, textures and the regularities that separate foreground from background. That is why it handles a person against a plain wall beautifully and struggles with a busy street, fur, or a subject that touches the frame edge.'
        }
      ]
    },
    {
      h2: 'An image editor that keeps your files on your device',
      paras: [
        'The obvious uses are harmless: a screenshot to crop, a photo to resize, a logo to convert. But a large share of images edited online are not casual. Scans of identity documents, photographs of a vehicle before a sale, client proofs a photographer must not publish, medical images, and anything under a confidentiality clause all end up in exactly these upload boxes.',
        'With a server-side editor, that file has been uploaded to a machine you do not control, stored for an unknown retention period, and potentially included in whatever training or backup process that service runs. You may have read a privacy policy about it, but the guarantee is a policy, not a property of the system. A local editor removes the question entirely, because there is nothing to leak.'
      ]
    },
    {
      h2: 'Remove background from a photo with AI',
      paras: [
        'Background removal is the feature that most free online tools use as a hook, and the hook is usually a signup wall or a preview at low resolution. Here the whole job happens in the tab, including the export at full size, with the transparency stored as an alpha channel rather than approximated.',
        'The honest limitations are worth knowing before you commit to it. Hair and fur give it trouble. Semi-transparent material confuses it. A subject touching the edge of the frame gets a hard cut. And a busy background behind a thin object, like a bicycle frame against foliage, is where most of these models stop being magic. When the automatic result is not good enough, the sensible workflow is to take the clean cut and clean up the edges by hand.'
      ]
    },
    {
      h2: 'Resize an image for Instagram, YouTube or an app icon',
      paras: [
        'The presets exist because the dimensions are the part nobody remembers and everybody looks up. Typing 1920 by 1080 from memory is how images end up stretched, cropped by a platform you did not expect, or rejected by an upload limit.',
        'Everything below is a common target size rather than a rule imposed by the editor. Platforms change their recommendations, so treat these as the sizes that keep working across most of them.'
      ],
      table: {
        caption: 'Common export sizes and what they are for',
        head: ['Preset', 'Size in pixels', 'Typical use'],
        rows: [
          ['Instagram post', '1080 x 1080', 'Square feed post'],
          ['Instagram stories', '1080 x 1920', 'Vertical story format'],
          ['YouTube thumbnail', '1280 x 720', 'Video thumbnail'],
          ['X / Twitter image', '1920 x 1080', 'Landscape post'],
          ['HD square', '512 x 512', 'Icon size that stays sharp'],
          ['Avatar', 'Small square', 'Profile picture crop']
        ]
      }
    },
    {
      h2: 'Convert PNG to JPG online free, and know when not to',
      paras: [
        'The three export formats are not interchangeable and choosing badly is the most common way an exported image ends up looking damaged. PNG is lossless and supports transparency, which makes it the correct choice for an icon, a logo or a cut-out subject, and the wrong choice for a photograph you need to send to someone.',
        'JPG is lossy: it compresses by discarding detail the eye is least likely to notice, and the quality slider controls how aggressively. WebP does the same job at smaller file sizes and, unlike JPG, can also be lossless and can carry transparency. If a platform accepts it, WebP is generally the better default for photographs.'
      ],
      table: {
        caption: 'Choosing an export format',
        head: ['Format', 'Compression', 'Transparency', 'Use it for'],
        rows: [
          ['PNG', 'Lossless, large files', 'Yes', 'Icons, logos, cut-out subjects, screenshots'],
          ['JPG', 'Lossy, small files', 'No', 'Photographs, anything being emailed or uploaded'],
          ['WebP', 'Lossy or lossless', 'Yes', 'The modern default for web images'],
          ['(Avoid)', 'Aggressive lossy settings', 'No', 'Re-saving a JPG repeatedly, which compounds loss']
        ]
      },
      h3s: [
        {
          h3: 'The re-save trap',
          text: 'Every time you open a JPG, edit it and export again, you compress an already compressed file. Five rounds of this is visibly worse. If you are going to edit repeatedly, keep a PNG or the original as your working copy and export to JPG once at the end.'
        }
      ]
    },
    {
      h2: 'Crop, rotate, filter and add text online free',
      paras: [
        'These are the unglamorous operations that make up most of the actual work, and the reason a heavyweight editor is usually overkill. Cropping for a profile picture, rotating a scan that came in sideways, applying a consistent filter across a set of images, and adding a caption or watermark are all mechanical once the dimensions are right.',
        'The text tool is worth a note. It offers a fixed set of common fonts rather than every font installed on your system, which keeps the rendering identical for everyone. That is a real advantage over some alternatives: the file will look the same on a machine that does not have your fonts, which matters for anything you are sending to print or handing to someone else.'
      ]
    },
    {
      h2: 'An image editor with no watermark and no limits',
      paras: [
        'There is no watermark, no export cap, no forced preview resolution and no account. The editor adds nothing to your image on the way out. That sounds unremarkable only until you have spent an afternoon removing a stamp from a generated image.',
        'It is worth being clear about the trade-off, though. A tool that runs locally and takes no payment is a tool with a very small budget, and it does not do everything. If you need layered working files, batch processing hundreds of images, colour-managed output for print, or RAW camera files, you want a dedicated desktop application instead.'
      ]
    },
    {
      h2: 'Where a local editor is the wrong tool',
      paras: [
        'Print work needs CMYK and proper colour profiles, which a browser canvas does not handle. Very large files hit the memory limits of a tab before they hit your disk. RAW formats need a dedicated converter. And if you are editing the same image across many revisions, a layered format such as PSD keeps more recoverable than a flattened export.',
        'None of that undermines the tool for its actual purpose. For a single image, resized, filtered, captioned and exported, a local browser editor is faster than installing anything, and it is the one case where you can be certain the file never left the machine. When your work is a design rather than a file, the write-up is usually the bottleneck rather than the pixels.'
      ],
      h3s: [
        {
          h3: 'The workflow that pairs with this',
          text: 'If the image is a symbol rather than a photograph — a sigil, an icon, a card face — the export step is only the last part. The <a href="sigil-generator.html">sigil generator</a> produces the mark, this editor renders it as a transparent PNG at the right size with the frame or rounded corners you want, and the <a href="../apps/chaos-sigil-generator.html">Magick Chaos Sigil Generator app</a> adds the library, the intent journal and the ritual timer. <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> covers the method behind the symbol itself.'
        }
      ]
    }
  ],
  faq: [
    {
      q: 'Is the image editor really free?',
      a: 'Yes. There is no signup, no watermark, no export limit and no paid tier. It is developed and maintained as an open tool.'
    },
    {
      q: 'Do I need to create an account?',
      a: 'No. Open the editor, drop an image in or paste it with the keyboard, and start working. There is no prior step and no form.'
    },
    {
      q: 'Are my images uploaded to a server?',
      a: 'No. Processing happens in your browser, and your images never leave your device. The background removal model is downloaded to your machine once and then cached locally.'
    },
    {
      q: 'Does it work without an internet connection?',
      a: 'Yes, once the AI model has been downloaded it stays in the browser cache. Resizing, cropping, filters, adjustments, text and export all work from the very first load.'
    },
    {
      q: 'What file formats can I open and export?',
      a: 'It opens JPG, PNG, WebP and GIF, and also accepts an image pasted from the clipboard. It exports PNG with transparency, JPG, or WebP with an adjustable quality setting.'
    },
    {
      q: 'Is the interface in English?',
      a: 'The editor itself is in Spanish, which is how the tool was built. This page is in English and covers exactly the same features, so nothing here depends on reading the interface.'
    },
    {
      q: 'Why is the background removal model so large?',
      a: 'Because it is a real segmentation model rather than a colour-range approximation. Ninety megabytes, downloaded once and cached, is what buys an accurate cut-out that runs without a server and without an account.'
    }
  ]
};