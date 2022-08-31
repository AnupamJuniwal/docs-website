import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GlobalHeader,
  Layout,
  Link,
  Logo,
  MobileHeader,
  useLayout,
} from '@newrelic/gatsby-theme-newrelic';
import { graphql } from 'gatsby';
import { css } from '@emotion/react';
import SEO from '../components/SEO';
import RootNavigation from '../components/RootNavigation';
import { animated, useTransition } from 'react-spring';
import { useLocation } from '@reach/router';

const MainLayout = ({ data = {}, children, pageContext }) => {
  const { nav } = data;
  const { contentPadding } = useLayout();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const transition = useTransition(nav, {
    key: nav?.id,
    config: { mass: 1, friction: 34, tension: 400 },
    initial: { position: 'absolute' },
    from: () => ({
      opacity: 0,
      position: 'absolute',
      transform: `translateX('125px')`,
    }),

    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: () => ({
      opacity: 0,
      transform: `translateX('125px')`,
    }),
  });

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <>
      <SEO location={location} />
      <GlobalHeader
        hideSearch={pageContext.slug === '/'}
        customStyles={{ navLeftMargin: '150px', searchRightMargin: '30px' }}
      />
      <MobileHeader>
        <RootNavigation nav={nav} />
      </MobileHeader>
      <Layout
        css={css`
          margin-top: 1rem;
          -webkit-font-smoothing: antialiased;
          font-size: 1.125rem;
        `}
      >
        <Layout.Sidebar
          css={css`
            background: var(--primary-background-color);
            hr {
              border-color: var(--border-color);
            }
          `}
        >
          <Link
            to="/"
            css={css`
              display: block;
              margin-bottom: 1rem;
              text-decoration: none;
            `}
          >
            <Logo />
          </Link>
          {transition((style, nav) => {
            const containerStyle = css`
              left: ${contentPadding};
              right: ${contentPadding};
              top: calc(${contentPadding} + 3rem);
              padding-bottom: ${contentPadding};
            `;

            return (
              <animated.div style={style} css={containerStyle}>
                <RootNavigation nav={nav} />
              </animated.div>
            );
          })}
        </Layout.Sidebar>
        <Layout.Main
          css={css`
            display: ${isMobileNavOpen ? 'none' : 'block'};
          `}
        >
          {children}
        </Layout.Main>
        <Layout.Footer fileRelativePath={pageContext.fileRelativePath} />
      </Layout>
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  pageContext: PropTypes.object,
};

export const query = graphql`
  fragment MainLayout_query on Query {
    nav(slug: $slug) {
      id
      title(locale: $locale)
      url
      filterable
      pages {
        ...MainLayout_navPages
        pages {
          ...MainLayout_navPages
          pages {
            ...MainLayout_navPages
            pages {
              ...MainLayout_navPages
              pages {
                ...MainLayout_navPages
                pages {
                  ...MainLayout_navPages
                }
              }
            }
          }
        }
      }
    }
  }

  fragment MainLayout_navPages on NavItem {
    title(locale: $locale)
    url
    icon
  }
`;

export default MainLayout;
