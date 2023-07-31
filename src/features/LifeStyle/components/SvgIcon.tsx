import React, { useCallback, useEffect, useState } from "react";
import { SvgXml } from "react-native-svg";

interface SvgIconProps {
  color?: string;
  height?: number | string;
  width?: number | string;
  uri: string;
}

export default function SvgIcon({ color, width = 24, height = 24, uri }: SvgIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  const fetchSvgContent = useCallback(() => {
    fetch(uri)
      .then(response => {
        if (!response.ok) {
          throw new Error("couldn't find the svg");
        }
        return response.text();
      })
      .then(svgText => {
        const modifiedSvgContent = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);
        setSvgContent(modifiedSvgContent);
      });
  }, [uri, color]);

  useEffect(() => {
    fetchSvgContent();
  }, [fetchSvgContent]);

  return <SvgXml xml={svgContent} width={width} height={height} />;
}
