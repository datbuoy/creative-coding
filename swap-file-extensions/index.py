import glob, os

print(os.chdir('../genart-7/final/'))

# for filename in glob.iglob(os.path.join(os.getcwd(), '*.png')):
#     os.rename(filename, filename.replace('.png', '.jpg'))

for count, f in enumerate(os.listdir()):
    f_name, f_ext = os.path.splitext(f)
    f_name = str(count + 1)
 
    new_name = f'{f_name}{f_ext}'
    os.rename(f, new_name)