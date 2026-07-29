import React from 'react'

export default function BreadCumb({ items }) {
    return (
        <div className="breadcrumb">
            {items.map((item, index) => (
                <span key={item.path}>
                    {index !== 0 && " > "}

                    {index === items.length - 1 ? (
                        <span>{item.label}</span>
                    ) : (
                        <Link to={item.path}>{item.label}</Link>
                    )}
                </span>
            ))}
        </div>
    )
}
