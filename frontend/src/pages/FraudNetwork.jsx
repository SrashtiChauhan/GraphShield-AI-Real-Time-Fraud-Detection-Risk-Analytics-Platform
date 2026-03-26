import { useEffect, useState } from "react";
import API from "../services/api";
import ForceGraph2D from "react-force-graph";

export default function FraudNetwork() {
  const [graph, setGraph] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetchGraph();

    const interval = setInterval(fetchGraph, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchGraph = async () => {
    try {
      const res = await API.get("/graph");
      setGraph(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌐 Fraud Network</h2>

      <div className="bg-white shadow rounded h-[600px]">
        <ForceGraph2D
          graphData={graph}
          nodeLabel="id"
          nodeColor={(node) =>
            node.type === "device" ? "#3b82f6" : "#10b981"
          }
          linkDirectionalParticles={2}
        />
      </div>
    </div>
  );
}