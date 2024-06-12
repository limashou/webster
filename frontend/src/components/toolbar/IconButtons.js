import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {
    ControlPoint, ControlPointOutlined,
    Download, EditAttributes, EditCalendar, EditLocation, EditSharp,
    FormatShapes,
    FormatShapesOutlined,
    FormatShapesSharp, FormatShapesTwoTone,
    Gesture,
    Group, GroupAddOutlined, GroupRounded, Groups, Groups3Sharp,
    KeyboardArrowDown, PointOfSale, PolylineOutlined, ShapeLineOutlined, Undo
} from "@mui/icons-material";
import FolderIcon from '@mui/icons-material/Folder';
import Text from "../shapes/Text";
import Image from "../shapes/Image";
import {fabric} from "fabric";
import {actionHandler, anchorWrapper, polygonPositionHandler} from "../../utils/EditPolygon";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import {Stack} from "@mui/material";

function IconButtons({ canvas, setObjectsSelectable, changeInstrument, setFiguresAnchorEl, setDrawingAnchorEl, lastSelectedDraw, lastSelectedTool }) {
    const [disabledEditPolygon, setDisabledEditPolygon] = useState(true);
    const [disabledGroup, setDisabledGroup] = useState(true);
    const [activeButtonFromIcons, setActiveButtonFromIcons] = useState(null);
    const [group, setGroup] = useState(null);
    useEffect(() => {
        if(canvas){
            const isDisabled = () => {
                const object = canvas.getActiveObject();
                setDisabledEditPolygon(!(object?.type === 'polygon' && !object?.group));
                setDisabledGroup(object?.type !== 'activeSelection');
                setGroup(object?.type === 'group');
            }
            canvas.on('selection:created', isDisabled);
            canvas.on('selection:updated', isDisabled);
            canvas.on('selection:cleared', isDisabled);
        }
    }, [canvas]);
    const handleButtonClick = (event, key, onClick) => {
        setActiveButtonFromIcons(key);
        onClick(event);
    };
    const handleFiguresClick = (event) => {
        setFiguresAnchorEl(event.currentTarget.parentElement);
    };
    const handleDrawClick = (event) => {
        setDrawingAnchorEl(event.currentTarget.parentElement);
    };
    function editPolygon() {
        const poly = canvas.getActiveObjects()[0];
        poly.edit = !poly.edit;

        if (poly.edit) {
            var lastControl = poly.points.length - 1;
            poly.cornerStyle = 'circle';
            poly.cornerColor = 'rgba(0,0,255,0.5)';
            poly.controls = poly.points.reduce(function (acc, point, index) {
                acc['p' + index] = new fabric.Control({
                    positionHandler: polygonPositionHandler,
                    actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
                    actionName: 'modifyPolygon',
                    pointIndex: index
                });
                return acc;
            }, {});
        } else {
            poly.cornerColor = 'blue';
            poly.cornerStyle = 'rect';
            poly.controls = fabric.Object.prototype.controls;
        }
        poly.hasBorders = !poly.edit;
        canvas.requestRenderAll();
    }
    function createGroup(){
        const object = canvas.getActiveObject();
        if(object.type === 'activeSelection') {
            object.toGroup();
        }
    }
    function destroyGroup() {
        const object = canvas.getActiveObject();
        if (object && object.type === 'group') {
            const parentGroup = object.group;
            const items = object._objects;

            object._restoreObjectsState();
            canvas.discardActiveObject();
            if (parentGroup) {
                parentGroup.removeWithUpdate(object);
                canvas.fire('object:removed', { target: object });
            } else {
                canvas.remove(object);
            }

            items.forEach((item) => {
                if (parentGroup) {
                    parentGroup.addWithUpdate(item);
                    canvas.fire('object:added', { target: item });
                } else {
                    item.evented = true;
                    canvas.add(item);
                }
            });

            canvas.renderAll();
        }
    }
    function exportGroupAsImage() {
        const object = canvas.getActiveObject();
        if (object && object.type === 'group') {
            const tempCanvas = new fabric.Canvas();

            const groupClone = fabric.util.object.clone(object);
            groupClone.set({ left: 0, top: 0 });
            tempCanvas.add(groupClone);
            tempCanvas.setWidth(groupClone.width);
            tempCanvas.setHeight(groupClone.height);

            const dataURL = tempCanvas.toDataURL({
                format: 'png',
                multiplier: 1,
                left: 0,
                top: 0,
                width: groupClone.width,
                height: groupClone.height,
            });

            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'group-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    const commonProps = {
        handleButtonClick: handleButtonClick,
        canvas: canvas,
        changeInstrument: changeInstrument,
        setObjectsSelectable: setObjectsSelectable,
        activeButtonFromIcons: activeButtonFromIcons
    };
    return (
        <Stack
            direction="row"
            spacing={0.5}
            sx={{ padding: 0 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: activeButtonFromIcons === 'shapes' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        cursor: 'pointer',
                    },
                }}
            >
                <IconButton
                    aria-label="last-tool"
                    onClick={(event) => {
                        handleButtonClick(event, 'shapes', lastSelectedTool ? lastSelectedTool.onClick : handleFiguresClick);
                    }}
                    sx={{ paddingRight: 0 }}
                >
                    {lastSelectedTool ? lastSelectedTool.icon : <PermDataSettingIcon />}
                </IconButton>
                <IconButton  onClick={(event) => handleButtonClick(event, 'shapes', handleFiguresClick)}
                    sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(2px)',
                            cursor: 'pointer',
                        },
                        padding: 0,
                     }}>
                    <KeyboardArrowDown fontSize={'small'}/>
                </IconButton>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: activeButtonFromIcons === 'draws' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        cursor: 'pointer',
                    },
                }}
            >
                <IconButton
                    aria-label="last-draw"
                    onClick={(event) => {
                        handleButtonClick(event, 'draws', lastSelectedDraw ? lastSelectedDraw.onClick : handleDrawClick);
                    }}
                    sx={{ paddingRight: 0 }}
                >
                    {lastSelectedDraw ? lastSelectedDraw.icon : <Gesture />}
                </IconButton>
                <IconButton   onClick={(event) =>  handleButtonClick(event, 'draws', handleDrawClick)} sx={{
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(2px)',
                        cursor: 'pointer',
                    },
                    padding: 0
                }}>
                    <KeyboardArrowDown fontSize={'small'}/>
                </IconButton>
            </Box>
            <Text key="add-text" {...commonProps} />
            <Image key="add-image" {...commonProps} />
            <IconButton
                key="edit-polygon"
                aria-label="menu"
                disabled={disabledEditPolygon}
                onClick={(event) => handleButtonClick(event, 'edit-polygon', editPolygon)}
                sx={{
                    backgroundColor: activeButtonFromIcons === 'edit-polygon' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                }}
            >
                <PolylineOutlined />
            </IconButton>
            <IconButton
                key="group"
                aria-label="create-group"
                disabled={!group && disabledGroup}
                onClick={(event) => handleButtonClick(event, 'group', !group ? createGroup : destroyGroup)}
                sx={{
                    backgroundColor: activeButtonFromIcons === 'group' && !group ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                }}
            >
                {!group ? <Groups/> : <Undo />}
            </IconButton>
            <IconButton
                key="export-group"
                aria-label="export-group"
                disabled={!group}
                onClick={(event) => handleButtonClick(event, 'export-group', exportGroupAsImage)}
                sx={{
                    backgroundColor: activeButtonFromIcons === 'export-group' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                }}
            >
                <Download />
            </IconButton>
        </Stack>
    );
}

export default IconButtons;