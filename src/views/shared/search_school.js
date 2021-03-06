'use strict';

import React from 'react';
import {Select,Input,Spin} from 'antd';
import {API_CONFIG} from '../../config/api';
import cFetch from "../../utils/cFetch"

let timeout;
let inputValue;
const Option = Select.Option;

class SearchSchool extends React.Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      svalue: false,
      avalue: true,
      data: [],
      selectValue: '',
      fetching: true,
      url: ''
    };
  }

  fetchData(selectValue, callback) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    inputValue = selectValue;
    let that=this;

    async function fake() {
      let params = {};
      params['keyword'] = selectValue;
      // params['per_page'] = 1000;
      let url = API_CONFIG.host + "/api/admin/fx/users/search_by_school_name";
      cFetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: params
      }).then((result) => {
        // console.log("res--------", json);
        if (inputValue === selectValue) {
          console.log("********", result.schools);
          callback(result.schools);
          that.setState({fetching: false})
        }
      }).catch((err) => {
        that.setState({fetching: false})
        return Promise.reject(err);
      });
    }

    timeout = setTimeout(fake, 300);
  }

//搜索显示；
  handleSearch(selectValue) {
    console.log("selectValue =========", selectValue, "/n selectValue =========", this.state.data);
    this.fetchData(selectValue, data => this.setState({data: data}));
  }


  onSelect(value) {
    this.setState({
      selectValue: value.key,
      fetching: false
    });
  }
  //
  // //选中时显示二维码；
  // handleSelect(selectValue, option) {
  //   // console.log("sel", selectValue, "op", option.props.url);
  //   this.setState({
  //     url: option.props.url
  //   });
  // }

  render() {
    const options = this.state.data.map((item, index) => {
      return (<Option  key={item.id}>{item.name}</Option>)
    });
    return (
      <div>
        <Select
          size="large"
          mode="combobox"
          showSearch
          // value={this.state.selectValue}
          placeholder="输入目标学校名称"
          className="select"
          // defaultActiveFirstOption={true}
          showArrow={false}
          filterOption={false}
          notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
          dropdownMatchSelectWidth={true}
          labelInValue={true}
          onSearch={this.handleSearch.bind(this)}
          onSelect={this.onSelect.bind(this)}
        >
          {options}
        </Select>
      </div>
    )
  }
}

export default SearchSchool;
