import React, { Component } from 'react';
import { fireStore } from '../../../firebase';
import _ from 'lodash';
import { Board } from './Board';
import { Row, Col, Button, Input, Select } from 'antd';

const { Option } = Select;

class StatGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: this.props.stats,
            columns: this.props.columns,
            name: null,
            statGroups: null,
            nameVisable: false
        };
    }

    componentDidMount() {
        let statGroupObjArr = []
        // GET ALL STATGROUPS 
        fireStore.collection('users').doc(this.props.dbKey).collection('statGroup').onSnapshot(async(snapshot) => {
            statGroupObjArr = []
            await snapshot.docs.map((doc, i) => {
                statGroupObjArr.push(<Option key={i} data={doc.data()} >{doc.data().name}</Option>) 
            })
            this.setState({ statGroups: statGroupObjArr })
        })
    }

    selectedStatGroup = (statGroup) => {

        let tempStats = this.props.stats.map(card => card.id)
        let newtempStats = tempStats.filter((word) => !statGroup.statArr.includes(word))

        this.setState({ name: statGroup.name })

        this.setState({
            columns: [
                {
                    id: 0,
                    title: 'one',
                    cardIds: newtempStats,
                },
                {
                    id: 1,
                    title: 'two',
                    cardIds: statGroup.statArr,
                }
            ]
        })

    }

    submit = () => {
        fireStore.collection("users").doc(this.props.dbKey).collection('statGroup').doc(this.state.name).set({ name: this.state.name, statArr: this.state.columns[1].cardIds })
    }

    moveCard = (cardId, destColumnId, index) => {

        this.setState(state => ({
            columns: state.columns.map(column => ({
                ...column,
                cardIds: _.flowRight(
                    // 2) If this is the destination column, insert the cardId.
                    ids =>
                        column.id === destColumnId
                            ? [...ids.slice(0, index), cardId, ...ids.slice(index)]
                            : ids,
                    // 1) Remove the cardId for all columns
                    ids => ids.filter(id => id !== cardId)
                )(column.cardIds),
            })),
        }));

    };

    handleChange = () => {
        console.log('changed');
    }
    
    render() {

        return (<Row justify="center">

            <Col span={4}>
                <Select
                    style={{ width: '100%', marginRight: '6px' }}
                    placeholder="Select Stat Group"
                    onChange={(e, data) => this.selectedStatGroup(data.data)}
                >
                    {this.state.statGroups}
                </Select>
                <div style={{ marginTop: '1em' }} onClick={() => this.setState({ nameVisable: true, name: null })}>Create New Stat Group</div>
            </Col>

            <Col span={10}>
                { this.state.nameVisable ? <Input style={{ width: '80%' }} onChange={(e) => this.setState({ name: e.target.value })} /> : null }
                { this.state.name && !this.state.nameVisable? this.state.name : null }
                <br />
                
                <Board
                    cards={this.state.cards}
                    columns={this.state.columns}
                    moveCard={this.moveCard}
                />
                <Button onClick={this.submit}>Submit</Button>
            </Col>

        </Row>
        );
    }
}

export default StatGroup
