import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import API from "../services/api";

export default function Graph() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetchGraph();

    // optional auto refresh (every 5 sec)
    const interval = setInterval(() => {
      fetchGraph();
    }, 5000);

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Fraud Network</h2>

      <div className="bg-white shadow-lg rounded p-2">
        <ForceGraph2D
          graphData={data}

          // 🎨 auto color by type (user/device)
          nodeAutoColorBy="type"

          // ✨ animation (looks pro)
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}

          // 🖊 label rendering
          nodeCanvasObject={(node, ctx) => {
            const label = node.label;
            ctx.font = "12px Sans-Serif";
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x + 6, node.y + 6);
          }}

          // 🔍 zoom to fit graph
          onEngineStop={(engine) => {
            engine.zoomToFit(400);
          }}
        />
      </div>
    </div>
  );
}