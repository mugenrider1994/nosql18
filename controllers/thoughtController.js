const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const getSingleThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(400).json({ message: 'No thought found!' });
    }
    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const createThought = async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'No user found with this Id!' });
    }
    const thought = await Thought.create({ thoughtText, username, userId });
    user.thoughts.push(thought._id);
    await user.save();
    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!thought) {
      return res.status(400).json({ message: 'No thought found with this Id!' });
    }
    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      return res.status(400).json({ message: 'No thought found with this Id!' });
    }
    const user = await User.findOne({ username: thought.username });
    user.thoughts.pull(thought._id);
    await user.save();
    res.json({ message: 'Thought deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const addReaction = async (req, res) => {
  try {
    const { reactionBody, username } = req.body;

    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(400).json({ message: 'No thought found with this Id!' });
    }
    thought.reactions.push({ reactionBody, username });
    await thought.save();
    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  addReaction,
  updateThought,
};