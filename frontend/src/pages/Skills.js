// ...existing code...
import React, { useState } from "react";
import { Check } from "lucide-react";
import { styles } from "../utils/styles";

export default function Skills() {
  const [selected, setSelected] = useState([]);

  const skillsList = [
    // Tech Skills
    "Coding",
    "Web Development",
    "Java",
    "Python",
    "C++",
    "ReactJS",
    "Node.js",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "AI Tools",
    "Blockchain",

    // Designing & Creative
    "Graphic Design",
    "UI/UX",
    "Prototyping",
    "Animation",
    "Video Editing",
    "Photography",
    "Illustration",
    "Canva Designing",

    // Music & Arts
    "Guitar",
    "Piano",
    "Music Production",
    "Singing",
    "Drawing",
    "Sketching",
    "Dancing",

    // Writing & Communication
    "Content Writing",
    "SEO",
    "Copywriting",
    "Public Speaking",
    "Presentation Skills",
    "Debate & Anchoring",

    // Personal Development
    "Cooking",
    "Baking",
    "Yoga",
    "Fitness & Gym",
    "Time Management",
    "Leadership",

    // Business & Management
    "Marketing",
    "Finance Basics",
    "Entrepreneurship",
    "Operations Management",
    "Digital Marketing",

    // Languages
    "English Fluency",
    "French",
    "Spanish",
    "German",

    // Extra Skills
    "Photography Editing",
    "Social Media Management",
    "Event Management",
    "Career Guidance",
  ];

  const toggleSkill = (skill) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // dark blue / black gradient background + spacing & improved pill contrast
  const bgStyle = {
    ...styles.container,
    background: "linear-gradient(135deg, #000814 0%, #001439 45%, #001f3a 100%)",
    minHeight: "100vh",
    padding: "40px 60px",
    color: "#e6f7ff",
  };

  return (
    <div style={bgStyle}>
      <h2 style={{ color: "#7be3ff", marginBottom: "20px" }}>Select Your Interests</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {skillsList.map((skill) => {
          const isSelected = selected.includes(skill);
          return (
            <div
              key={skill}
              onClick={() => toggleSkill(skill)}
              style={{
                padding: "10px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                border: `1px solid ${isSelected ? "#7be3ff" : "rgba(255,255,255,0.14)"}`,
                background: isSelected ? "rgba(123,227,255,0.08)" : "rgba(255,255,255,0.02)",
                color: isSelected ? "#7be3ff" : "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.18s ease",
                boxShadow: isSelected ? "0 4px 12px rgba(0, 198, 255, 0.06)" : "none",
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: 14 }}>{skill}</span>
              {isSelected && <Check size={16} color="#7be3ff" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ...existing code...