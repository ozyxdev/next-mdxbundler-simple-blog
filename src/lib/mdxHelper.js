import fs from 'fs';
import path from 'path';

const { readdir, readFile } = fs.promises;

async function getMDXComponents() {
  const directory = 'src/components/shared';
  const files = await readdir(directory);

  const components = await Promise.all(
    files.map(async (file) => {
      const fileBuffer = await readFile(path.join(directory, file), 'utf8');
      const fileString = fileBuffer.toString().trim();
      const filePath = `./${file}`;
      return [filePath, fileString];
    })
  );

  return Object.fromEntries(components);
}

async function getPostBySlug(slug) {
  const dir = path.join(process.cwd(), 'src/posts/');
  const fileBuffer = await readFile(path.join(dir, `/${slug}.mdx`), 'utf8');
  return fileBuffer;
}

export { getMDXComponents, getPostBySlug };
