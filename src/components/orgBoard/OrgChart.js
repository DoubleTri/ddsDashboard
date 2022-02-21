import React from 'react';
import { Col, Row } from 'antd';

function OrgChart({ tree, NodeComponent, owner }) {

    const renderChildren = (node) => {

        const hasSiblingRight = (childIndex) => {
            return (node.children || []).length > (childIndex + 1)
        };

        const hasSiblingLeft = (childIndex) => {
            return childIndex > 0
        };

        const nodeLineBelow = (
            <td colSpan={(node.children || []).length * 2} className="nodeGroupCellLines">
                <table className="nodeLineTable">
                    <tbody>
                        <tr>
                            <td colSpan={2} className="nodeLineCell nodeGroupLineVerticalMiddle" />
                            <td colSpan={2} className="nodeLineCell" />
                        </tr>
                    </tbody>
                </table>
            </td>
        );

        const childrenLinesAbove = (node.children || []).map((child, childIndex) => (
            <td colSpan="2" className="nodeGroupCellLines" key={childIndex}>
                <table className="nodeLineTable">
                    <tbody>
                        <tr>
                            <td colSpan={2} className={"nodeLineCell nodeGroupLineVerticalMiddle" + (hasSiblingLeft(childIndex) ? ' nodeLineBorderTop' : '')} />
                            <td colSpan={2} className={"nodeLineCell" + (hasSiblingRight(childIndex) ? " nodeLineBorderTop" : "")} />
                        </tr>
                    </tbody>
                </table>
            </td>
        ));

        const children = (node.children || []).map((child, childIndex) => (
            <td colSpan="2" className="nodeGroupCell" key={childIndex} >
                {renderChildren(child)}
            </td>
        ));

        return (
            <table className="orgNodeChildGroup">
                <tbody>
                    <tr>
                        <td className="nodeCell" id={node.post} colSpan={(node.children || []).length * 2}>
                            <NodeComponent node={node}  />
                        </td>
                    </tr>
                    <tr>
                        {(node.children || []).length > 0 && nodeLineBelow}
                    </tr>
                    <tr>
                        {childrenLinesAbove}
                    </tr>
                    <tr>
                        {children}
                    </tr>
                </tbody>
            </table>
        )
    };

    return (
        <Row className="reactOrgChart" align="bottom" >

            <Col flex="230px" id='owner' >
                {renderChildren(owner)}
            </Col>

            <Col flex="1400" >
                {renderChildren(tree)}
            </Col>

        </Row>
    )
};

export default OrgChart;