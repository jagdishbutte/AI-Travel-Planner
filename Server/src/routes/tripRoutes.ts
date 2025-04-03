router.post("/generate-ai", async (req, res) => {
  try {
    const { location, days, travelers, budget } = req.body;
    const tripPlan = await generateTripPlan(location, days, travelers, budget);
    res.json(tripPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});
