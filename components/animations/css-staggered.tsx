"use client"

import React, { ReactNode, useEffect, useRef, useState } from "react"

interface StaggeredProps {
  children: ReactNode
  staggerAmount?: number
  delay?: number
  className?: string
}

export function CssStaggered({
  children,
  staggerAmount = 0.1,
  delay = 0,
  className = "",
}: StaggeredProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    
    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])
  
  // Process children to add staggered delays
  const staggeredChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    // Find all elements with opacity: 0 and add animation
    const processNode = (node: React.ReactElement<any, any>): React.ReactNode => {
      if (!React.isValidElement(node)) return node;
      
      // If it has children, process them recursively
      if (node.props && (node.props as any).children) {
        const processedChildren: React.ReactNode = React.Children.map((node.props as any).children as React.ReactNode, (child) => {
          if (!React.isValidElement(child)) return child;
          return processNode(child as React.ReactElement<any, any>);
        }) as React.ReactNode;
        
        return React.cloneElement(node, {}, processedChildren);
      }
      
      // Check if this element has opacity: 0
      const classNameProp = (node.props && (node.props as any).className) as string | undefined;
      if (classNameProp && classNameProp.includes('opacity-0')) {
        const childDelay = delay + (index * staggerAmount);
        
        return React.cloneElement(node, {
          ...(node.props as any),
          style: {
            ...((node.props as any)?.style),
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease, transform 0.5s ease`,
            transitionDelay: `${childDelay}s`
          },
        } as any);
      }
      
      return node;
    };
    
    return processNode(child);
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? staggeredChildren : children}
    </div>
  )
}
