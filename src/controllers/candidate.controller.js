import asyncHandler from "express-async-handler";
import { Candidate } from "../models/candidate.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const isAdmin = async (id) => {
  const user = await User.findById(id);
  return user?.role === "admin";
};

//register
const registerCandidate = asyncHandler(async (req, res) => {
  if (!(await isAdmin(req.user._id))) {
    throw new ApiError(401, "Only admin can register the candidate");
  }
  const { name, party } = req.body;
  if (!name || !party) {
    throw new ApiError(401, "fill the fields");
  }
  const candidate = await Candidate.create({ name, party });
  return res.json(new ApiResponse(200, candidate));
});

//update candidate
const updateCandidate = asyncHandler(async (req, res) => {
  if (!(await isAdmin(req.user._id))) {
    throw new ApiError(401, "Only admin can update the candidate");
  }
  const { name, party } = req.body;
  const candidateID = req.params.id;

  const updatedCandidate = await Candidate.findByIdAndUpdate(
    candidateID,
    { name, party },
    { new: true }
  );
  if (!updateCandidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }
  return res.json(new ApiResponse(200, updatedCandidate));
});

//delete candidate
const deleteCandidate = asyncHandler(async (req, res) => {
  if (!(await isAdmin(req.user._id))) {
    throw new ApiError(401, "Only admin can update the candidate");
  }
  const candidateID = req.params.id;

  const response = await Candidate.findByIdAndDelete(candidateID);

  if (!response) {
    return res.status(404).json({ error: "Candidate not found" });
  }

  console.log("candidate deleted");
  res.status(200).json(new ApiResponse(201, response));
});

//get candidate
const candidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find({}, "name party _id");
  res.status(200).json(candidates);
});

//vote the candidates
const votecandidate = asyncHandler(async (req, res) => {
  const isadmin = await isAdmin(req.user._id);
  if (isadmin) {
    throw new ApiError(401, "Admins cant vote");
  }
  const userID = req.user._id;
  const user = await User.findById(userID);

  if (!user) {
    throw new ApiError(401, "User not found");
  }
  if (user.isVoted) {
    throw new ApiError(401, "User already had given a vote");
  }

  const candidateId = req.params.id;
  const candidate = await Candidate.findById(candidateId);
  user.isVoted = true;
  await user.save();

  candidate.voteCount++;
  candidate.votes.push({ user });
  await candidate.save();

  return res.status(200).json({ message: "Vote recorded successfully" });
});

//voteCount of candidates
const voteCount = asyncHandler(async (req, res) => {
  const candidate = await Candidate.find().sort({ voteCount: "desc" });
  const voteRecord = candidate.map((data) => {
    return {
      party: data.party,
      count: data.voteCount,
    };
  });

  return res.status(200).json(voteRecord);
});

export {
  registerCandidate,
  updateCandidate,
  deleteCandidate,
  candidates,
  votecandidate,
  voteCount,
};
