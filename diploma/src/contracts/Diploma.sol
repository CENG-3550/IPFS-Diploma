pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Diploma{
    uint public diplomaCount = 0;

    struct DiplomaObj{
      uint id;
      string diplomaHash;
      string diplomaName;
      string diplomaStudenID;
    }

    mapping(uint => DiplomaObj) public diplomas;

    function createDiploma(string memory _diplomaHash, string memory _diplomaName, string memory _diplomaStudenID) public{
        diplomas[diplomaCount] = DiplomaObj(diplomaCount, _diplomaHash, _diplomaName,_diplomaStudenID);
        diplomaCount ++;


    }

    function getDiplomaCount() view public returns (uint) {
      return diplomaCount;
    }

    function getTdip() public view returns (DiplomaObj[] memory){
      DiplomaObj[] memory trrips = new DiplomaObj[](diplomaCount);
      for (uint i = 0; i < diplomaCount; i++) {
          DiplomaObj storage trrip = diplomas[i];
          trrips[i] = trrip;
      }
      return trrips;
  }
}
