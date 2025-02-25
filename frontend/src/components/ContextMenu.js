import React from "react";
import "./ContextMenu.css";

function ContextMenu({ x, y, content }) {
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      {content}
    </div>
  );
}

export default ContextMenu;