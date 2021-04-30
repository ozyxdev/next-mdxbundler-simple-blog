import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getMDXComponents, getPostBySlug } from '../../lib/mdxHelper';

export async function getStaticProps() {
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe'
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild'
    );
  }
  const components = await getMDXComponents();
  const post = await getPostBySlug('demo');

  const result = await bundleMDX(post, {
    files: components,
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      };
      return options;
    },
  });

  const { code, frontmatter } = result;
  return {
    props: {
      code,
      frontmatter,
    },
  };
}

export default function Blog({ code, frontmatter }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <div>
      <h1>Blog</h1>
      <Component />
    </div>
  );
}
