import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import Nav from "../Components/Nav";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const ERepo = () => {
  const [user, setUser] = useState(null);
  const { getUserState, login } = useContext(UserContext);

  const [folders, setFolders] = useState([]);

  const [files, setFiles] = useState([]);

  const [checkedFolders, setCheckedFolders] = useState([]);

  const [checkedFiles, setCheckedFiles] = useState([]);

  const [path, setPath] = useState("/");

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setPath(location.state.path);
    }
  }, [location]);

  useEffect(() => {
    if (!getUserState().user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      login(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(getUserState().user);
    }
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      const res = await axios.get("http://localhost:8081/api/folders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      setFolders(res.data.data);
    };
    const fetchFiles = async () => {
      const res = await axios.get("http://localhost:8081/api/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      setFiles(res.data.data);
    };
    fetchFolders();
    fetchFiles();
  }, []);

  const createFolder = async () => {
    const folderName = prompt("Enter folder name");

    try {
      const res = await axios.post(
        "http://localhost:8081/api/folders",
        {
          name: folderName,
          path: path,
          owner: user._id,
          username: user.name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setFolders([res.data.data, ...folders]);
    } catch (err) {
      console.log(err);
      alert("Error creating folder");
    }
  };

  const deleteFilesOrFolders = async () => {
    console.log(checkedFolders, checkedFiles);

    if (checkedFolders.length === 0 && checkedFiles.length === 0) {
      alert("Please select a folder or file to delete");
      return;
    }

    try {
      checkedFolders.forEach(async (folderId) => {
        try {
          const res = await axios.delete(
            `http://localhost:8081/api/folders/${folderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(res.data);
          setFolders(folders.filter((folder) => folder._id !== folderId));
        } catch (err) {
          console.log(err);
          if (err.response) {
            return alert(err.response.data.message);
          } else {
            return alert("Error deleting folder");
          }
        }
      });

      checkedFiles.forEach(async (fileId) => {
        try {
          const res = await axios.delete(
            `http://localhost:8081/api/files/${fileId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log(res.data);
          setFiles(files.filter((file) => file._id !== fileId));
        } catch (err) {
          console.log(err);
          if (err.response.data.message) {
            return alert(err.response.data.message);
          } else {
            return alert("Error deleting file");
          }
        }
      });

      setCheckedFolders([]);
      setCheckedFiles([]);
    } catch (err) {
      console.log(err);
      if (err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error deleting folder");
      }
      setCheckedFolders([]);
      setCheckedFiles([]);
    }
  };

  const uploadFile = async (e) => {
    document.getElementById("myFileInput").click();

    document.getElementById("myFileInput").onchange = async (e) => {
      const file = e.target.files[0];

      console.log(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);
      formData.append("owner", user._id);
      formData.append("username", user.name);

      try {
        const res = await axios.post(
          "http://localhost:8081/api/files",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data);

        setFiles([res.data.data, ...files]);
      } catch (err) {
        console.log(err);
        if (err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Error uploading file");
        }
      }
    };
  };

  const downloadFile = (fileId) => {
    let currentFile = null;

    files.forEach((file) => {
      if (file._id === fileId) {
        currentFile = file;
      }
    });

    console.log(currentFile);

    function downloadFile(buffer, filename) {
      // convert buffer to base64 string
      const base64String = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // create a link
      const link = document.createElement("a");
      link.href = "data:application/octet-stream;base64," + base64String;
      link.download = filename;

      // trigger download
      link.click();

      // cleanup
      link.remove();
    }

    downloadFile(currentFile.data.data, currentFile.name);
  };

  return (
    <>
      <Nav />
      {!user ? (
        <div className="container">You need to login to view this page</div>
      ) : (
        <div className="container">
          <div className="repo-btn-grp btn-group">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={createFolder}
            >
              <i className="fa-solid fa-folder-plus"></i>
              New Folder
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={uploadFile}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Upload
            </button>
            <input
              type="file"
              id="myFileInput"
              style={{
                display: "none",
              }}
            />
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={deleteFilesOrFolders}
            >
              <i className="fa-solid fa-trash"></i>
              Delete
            </button>
          </div>
          <div className="repo-path">
            <span className="repo-path-item">{path}</span>
            <hr className="repo-path-hr" />
          </div>
          <div className="repo-content">
            {folders.map((folder) =>
              // check if folders path is same as current path
              folder.path === path ? (
                <div key={folder._id} className="repo-content-item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="repo-content-item-checkbox"
                        checked={checkedFolders.includes(folder._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedFolders([...checkedFolders, folder._id]);
                          } else {
                            setCheckedFolders(
                              checkedFolders.filter((id) => id !== folder._id)
                            );
                          }
                        }}
                      />
                      <i className="fa-solid fa-folder"></i>
                      <Link
                        to="/eRepo"
                        state={{
                          path: `${path}${folder.name}/`,
                        }}
                        className="repo-content-item-name"
                      >
                        {folder.name}
                      </Link>
                    </div>
                    <div>
                      <span className="repo-content-item-owner">
                        Created By: {folder.username}
                      </span>
                    </div>
                  </div>

                  <hr className="repo-content-hr" />
                </div>
              ) : null
            )}

            {files.map((file) =>
              // check if folders path is same as current path
              file.path === path ? (
                <div key={file._id} className="repo-content-item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="repo-content-item-checkbox"
                        checked={checkedFiles.includes(file._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedFiles([...checkedFiles, file._id]);
                          } else {
                            setCheckedFiles(
                              checkedFiles.filter((id) => id !== file._id)
                            );
                          }
                        }}
                      />
                      <i className="fa-solid fa-file"></i>
                      <button
                        className="repo-content-item-name"
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                        onClick={() => downloadFile(file._id)}
                      >
                        {file.name}
                      </button>
                    </div>
                    <div>
                      <span className="repo-content-item-owner">
                        Created By: {file.username}
                      </span>
                    </div>
                  </div>

                  <hr className="repo-content-hr" />
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ERepo;
