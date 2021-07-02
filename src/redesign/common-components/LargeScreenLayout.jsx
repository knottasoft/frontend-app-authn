import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { Hyperlink, Image } from '@edx/paragon';

import LargeScreenLeftLayout from './LargeScreenLeftLayout';

const LargeScreenLayout = () => (
  <div className="container row p-0 m-0 large-screen-container">
    <div className="col-md-9 p-0 screen-header">
      <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
        <Image alt="edx" className="logo" src={getConfig().LOGO_WHITE_URL} />
      </Hyperlink>
      <LargeScreenLeftLayout />
    </div>
    <div className="col-md-3 p-0 screen-polygon">
      <svg width="100%" height="100%" className="ml-n1 large-screen-svg" preserveAspectRatio="xMaxYMin meet">
        <g transform="skewX(171.6)">
          <rect x="0" y="0" height="100%" width="100%" />
        </g>
      </svg>
    </div>
  </div>
);

export default LargeScreenLayout;
