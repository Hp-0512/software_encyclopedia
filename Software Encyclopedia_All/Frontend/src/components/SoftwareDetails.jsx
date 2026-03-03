import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Header from "./Header";
import ReviewsList from "./ReviewsList";
import Footer from "../components/Footer";
import "../CSS/SoftwareDetails.css";

const SoftwareDetails = () => {
  const { id } = useParams();
  const [software, setSoftware] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateContent = async (softwareName) => {
    try {
      const res = await axios.post(
        "http://https://software-encyclopedia-2.onrender.com/api/ai-details/generate",
        {
          softwareName: softwareName,
        },
      );

      setSoftware((prev) => ({
        ...prev,
        ...res.data,
      }));
    } catch (error) {
      console.error("AI generation failed:", error);
    }
  };

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const res = await axios.get(
          `http://https://software-encyclopedia-2.onrender.com/api/softwares/${id}`,
        );

        setSoftware(res.data);

        if (!res.data.overview) {
          // We don't necessarily need to wait for the AI to finish
          // before showing the basic UI, so we set loading to false here.
          generateContent(res.data.SoftwareName);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // ✅ THIS IS THE MISSING PIECE
        setLoading(false);
      }
    };

    fetchSoftware();
  }, [id]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!software) return <div>Software not found</div>;

  return (
    <>
      <Header />

      <div className="details-container">
        <div className="details-hero">
          <img src={software.LogoUrl} alt={software.SoftwareName} />
          <div>
            <h1>{software.SoftwareName}</h1>
            <p>{software.ShortDescription}</p>
          </div>
        </div>

        <div className="details-content">
          <section>
            <h2>Overview</h2>
            <ReactMarkdown>{software.LongOverview}</ReactMarkdown>
          </section>

          <section>
            <h2>Development History</h2>
            <ReactMarkdown>{software.DevelopmentHistory}</ReactMarkdown>
          </section>

          <section>
            <h2>Features</h2>
            <ReactMarkdown>{software.Features}</ReactMarkdown>
          </section>

          <section>
            <h2>Recent Reviews</h2>
            <ReviewsList softwareName={software.SoftwareName} />
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SoftwareDetails;
