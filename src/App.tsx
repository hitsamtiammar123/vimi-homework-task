import React, { useState } from 'react';
import {
  Container,
  Input,
  InputGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';
import './App.scss';

function App() {
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);

  return (
    <Container className="my-5">
      <h3>Hello Hitsam</h3>
      <span>Here is the list of your video</span>
      <Container className="mt-4 video-main-container">
        <div className="d-flex flex-row">
          <InputGroup>
            <ButtonDropdown isOpen={isFilterOpen} toggle={() => setFilterOpen(!isFilterOpen)}>
              <DropdownToggle caret>Filter</DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Filter 1</DropdownItem>
                <DropdownItem>Filter 2</DropdownItem>
                <DropdownItem>Filter 3</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <Input placeholder="Search project..." />
          </InputGroup>
          <Input className="sort-selection" type="select">
            <option value="0">Sort by</option>
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </Input>
        </div>
        <div className="d-flex flex-column">
          <div className="table-component mt-3">
            <div className="table-heading">
              <div className="table-data">Name</div>
              <div className="table-data">Type</div>
              <div className="table-data">Status</div>
              <div className="table-data">Created</div>
              <div className="table-data">Manage</div>
            </div>
            {Array.from(Array(10)).map((i, index) => (
              <div key={index} className="table-row">
                <div className="table-data">eBay</div>
                <div className="table-data">Educational</div>
                <div className="table-data">Completed</div>
                <div className="table-data">20 January 2020</div>
                <div className="table-data">|</div>
              </div>
            ))}
            <div className="d-flex flex-row justify-content-center">
              <Pagination>
                <PaginationItem>
                  <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>3</PaginationLink>
                </PaginationItem>
              </Pagination>
            </div>
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default App;
