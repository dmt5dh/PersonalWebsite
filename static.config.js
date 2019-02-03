import React, { Component } from 'react'

//Graph CMS stuffs
import { request } from 'graphql-request'

const GRAPHCMS_API = 'https://api-useast.graphcms.com/v1/cjns9sf7s0n3701glf3zoi7l0/master';
const query = `
  {
    posts(where:{status:PUBLISHED}) {
      id
      title
    }
  }
`

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { posts } = await request(GRAPHCMS_API, query);

    return [
      {
        path: '/',
        component: 'src/pages/index',
        getData: () => ({
          name: 'Dan Truong',
          headline: 'About Me',
          intro: 'Greetings! My name is Dan and I\'m a software developer ' +
          'based in Washington D.C. I graduated from the University of ' +
          'Virginia with a Bachelors of Science in Computer Engineering. ' +
          'Since then, I worked as a freelance mobile developer and a ' +
          'technical consultant for government agencies. I am currently a ' +
          'technical manager on various government projects. In my free time ' +
          'I enjoy amateur photography, watching/talking/doing combat sports, ' +
          'and chilling with my Golden Retriever and cat.',
          button: 'Github'
        }),
      },
      {
        path: '/blog',
        getData: () => ({
          blogPosts: posts,
          title: 'Blog'
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getData: () => ({
            post,
          }),
        })),
      },
    ]
  },
  Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dan T.</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossOrigin="anonymous"/>
      </Head>
      <Body>
        {children}
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossOrigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossOrigin="anonymous"></script>
      </Body>
    </Html>
  ),
}
