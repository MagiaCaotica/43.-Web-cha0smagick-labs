from PIL import Image
import os

folder = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\gifs_animados_pinterest'
for f in sorted(os.listdir(folder)):
    if f.endswith('.gif'):
        im = Image.open(os.path.join(folder, f))
        print(f'{f}: {getattr(im, "n_frames", 1)} frames, {im.size}')