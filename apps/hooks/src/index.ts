    // apps/hooks/src/index.ts
    import express from "express";
    import { db } from "@repo/db/client";
    import { driveRouter } from "./drive-webhook";

    const app = express();
    const PORT = 3001;

    app.use(express.json());

    // Register the existing route
    app.post("/hooks/catch/:flowId/:userId", async (req, res) => {
    try {
        const flowId = req.params.flowId;
        const userId = req.params.userId;
        const body = req.body;

        await db.$transaction(async txn => {
        const state = await txn.flowState.create({
            data: {
            flowId,
            metaData: body
            }
        });
        await txn.flowStateOutBox.create({
            data: {
            flowStateId: state.id
            }
        });
        });
        res.status(200).json({ message: "Webhook created!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({
        message: "Something went wrong"
        });
    }
    });

    // Register the Drive webhook router
    app.use(driveRouter);

    app.listen(PORT, () => {
    console.log(`Hooks service running on port ${PORT}`);
    });