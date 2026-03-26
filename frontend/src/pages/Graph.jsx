import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import API from "../services/api";

export default function Graph() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetchGraph();

    const interval = setInterval(fetchGraph, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchGraph = async () => {
    try {
      const res = await API.get("/graph");

      setData({
        nodes: res.data.nodes,
        links: res.data.edges
      });
    } catch (err) {
      console.error("Graph error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 overflow-hidden">
      
      <h2 className="text-2xl font-bold mb-4">Fraud Network</h2>

      {/* 🔥 FULL SCREEN GRAPH */}
      <div className="flex-1 bg-white shadow-lg rounded overflow-hidden">

        <ForceGraph2D
          graphData={data}

          width={window.innerWidth - 300}  // adjust sidebar
          height={window.innerHeight - 120}

          nodeAutoColorBy="type"

          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}

          nodeCanvasObject={(node, ctx) => {
            const label = node.label || node.id;
            ctx.font = "12px Sans-Serif";
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x + 6, node.y + 6);
          }}

          nodeColor={(node) => {
            if (node.risk === "HIGH") return "#ef4444";
            if (node.type === "device") return "#3b82f6";
            return "#10b981";
          }}

          onEngineStop={(engine) => {
            engine.zoomToFit(400);
          }}
        />

      </div>
    </div>
  );
}