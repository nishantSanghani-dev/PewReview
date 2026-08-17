import React from 'react';
import { Link } from 'react-router-dom';

export default function BreadCumb({ items }) {
  return (
    <div className="mb-4 page-title activity-breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item.path || index}>
          {index !== 0 && <span className="mx-2 text-dark">/</span>}

          {index === items.length - 1 ? (
            <span className="fw-bold text-dark">{item.label}</span>
          ) : item.path ? (
            <Link
              to={item.path}
              className="text-danger fw-bold text-decoration-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-danger fw-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
