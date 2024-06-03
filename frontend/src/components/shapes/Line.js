import React, {useRef, useState} from 'react';
import {ListItemIcon, ListItemText} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {HorizontalRuleOutlined} from "@mui/icons-material";
import {fabric} from "fabric";
import {getOffsets, getPointerStart, setLineCoordinates, setPointsCoordinates} from "../../utils/CoordinatesUtils";

function Line({canvas, handleFiguresClose}) {
    const isDrawing = useRef(false);
    const drawingLine = useRef(null);
    const pointProps = {
        radius: 3,
        fill: 'white',
        hasControls: false,
        hasBorders: false,
        originX: 'center',
        originY: 'center',
        strokeWidth: 0,
        hoverCursor: 'move',
        visible: false,
        linePoint: true,
        needToHide: true
    };
    const handlePointMoving = (drawingLine, point, isStartPoint) => {
        const { left, top } = point;
        if (isStartPoint) {
            drawingLine.set({ x1: left, y1: top });
        } else {
            drawingLine.set({ x2: left, y2: top });
        }
        drawingLine.setCoords();
        canvas.renderAll();
    };
    const handleMouseDown = (opt) => {
        isDrawing.current = true;
        const pointer = canvas.getPointer(opt.e);
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        drawingLine.current = new fabric.Line(points, {
            strokeWidth: 2,
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            perPixelTargetFind: true,
            selectable: true,
            hasControls: false,
            hasBorders: false
        });
    };
    const handleMouseMove = (opt) => {
        if (!isDrawing.current) return;
        if (!canvas.contains(drawingLine.current))
            canvas.add(drawingLine.current);
        const pointer = canvas.getPointer(opt.e);
        drawingLine.current.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    };
    const handleMouseUp = (opt) => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        canvas.selection = true;
        drawingLine.current.setCoords();
        if (drawingLine.current.x1 === drawingLine.current.x2 && drawingLine.current.y1 === drawingLine.current.y2) {
            drawingLine.current = null;
            return;
        }
        addEndPoints();
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
    };
    const addEndPoints = () => {
        const p1 = new fabric.Circle({
            ...pointProps,
            left: drawingLine.current.x1,
            top: drawingLine.current.y1
        });
        const p2 = new fabric.Circle({
            ...pointProps,
            left: drawingLine.current.x2,
            top: drawingLine.current.y2
        });
        let startX = 0, startY = 0;
        drawingLine.current.p1 = p1;
        drawingLine.current.p2 = p2;
        drawingLine.current.withPoints = true;

        p1.on('moving', (o) => handlePointMoving(drawingLine.current, p1, true));
        p2.on('moving', (o) => handlePointMoving(drawingLine.current, p2, false));
        canvas.on('mouse:down', (opt) => {
            ({ startX, startY } = getPointerStart(canvas, opt));
        });
        drawingLine.current.on('moving', function (opt) {
            if (drawingLine.current.p1.visible || drawingLine.current.p2.visible) {
                drawingLine.current.p1.visible = false;
                drawingLine.current.p2.visible = false;
                canvas.renderAll();
            }
        });
        drawingLine.current.on('modified', function (opt) {
            const { offsetX, offsetY } = getOffsets(canvas, opt, startX, startY);
            setPointsCoordinates(drawingLine.current, offsetX, offsetY);
            drawingLine.current.p1.visible = true;
            drawingLine.current.p2.visible = true;
            setLineCoordinates(drawingLine.current);
            canvas.renderAll();
        });

        canvas.add(p1);
        canvas.add(p2);
        canvas.renderAll();
    };
    const createLine = () => {
        canvas.selection = false;
        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move',  handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);
        handleFiguresClose();
    };

    return (
        <MenuItem onClick={createLine}>
            <ListItemIcon><HorizontalRuleOutlined fontSize="small" /></ListItemIcon>
            <ListItemText>Line</ListItemText>
        </MenuItem>
    );
}

export default Line;