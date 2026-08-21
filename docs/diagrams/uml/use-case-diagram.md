# Use Case Diagram

flowchart LR

    User((User))

    subgraph Prodixus["Prodixus"]
        UC1["Register account"]
        UC2["Login"]
        UC3["Refresh session"]
        UC4["Logout"]

        UC5["Manage profile"]
        UC6["Manage settings"]

        UC7["Manage projects"]
        UC8["Manage tasks"]
        UC9["Manage tags"]
        UC10["Manage folders"]

        UC11["Organize tasks"]
        UC12["Manage subtasks"]
        UC13["Assign tags to tasks"]
        UC14["Organize projects into folders"]
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4

    User --> UC5
    User --> UC6

    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10

    User --> UC11
    User --> UC12
    User --> UC13
    User --> UC14

    UC8 -.->|includes| UC11
    UC8 -.->|includes| UC12
    UC8 -.->|includes| UC13
    UC7 -.->|includes| UC14
