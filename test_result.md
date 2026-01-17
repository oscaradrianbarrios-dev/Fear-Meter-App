#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Test the FEAR METER biometric horror application at https://stress-monitor-3.preview.emergentagent.com"

frontend:
  - task: "Main Monitor View"
    implemented: true
    working: true
    file: "/app/frontend/src/components/Monitor.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - Header with FEAR METER v1.0 text and hamburger menu, ECG Oscilloscope canvas, Data Grid with BPM/STRESS/SIGNAL, Circular START/STOP button"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All main monitor view elements working perfectly: FEAR METER v1.0 header visible, hamburger menu functional, ECG oscilloscope canvas animating, data grid showing BPM/STRESS/SIGNAL labels, circular START SESSION button working"

  - task: "Session Management"
    implemented: true
    working: true
    file: "/app/frontend/src/hooks/useBiometricSimulation.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - START/STOP session functionality, BPM fluctuation 60-140, stress proportional to BPM, signal status changes, tap to increase BPM/stress"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Session management working excellently: START/STOP button toggles correctly, BPM fluctuates in expected range (observed 73→137), stress increases proportionally, signal changes to ACTIVE/CRITICAL, tap interactions increase BPM/stress as expected"

  - task: "Panic Mode"
    implemented: true
    working: true
    file: "/app/frontend/src/components/CriticalAlert.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - Red flash overlay when BPM > 110, CRITICAL STRESS DETECTED text, UI blocks for 1 second, aggressive animations"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Panic mode working perfectly: Red flash overlay triggered when BPM reached 137 (>110), 'CRITICAL STRESS DETECTED' text displayed, UI properly blocked for 1 second (confirmed by click interception errors), aggressive animations and jitter effects active"

  - task: "Side Menu Navigation"
    implemented: true
    working: true
    file: "/app/frontend/src/components/SideMenu.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - Opens from right side, contains Monitor/Watch Mode/History/Language/About options, language switch EN/ES"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Side menu navigation working perfectly: Opens from right side with slide-in animation, all menu items visible (Monitor, Watch Mode, History, Language, About/Legal), language switch EN/ES functional with proper text translations"

  - task: "Watch Mode"
    implemented: true
    working: true
    file: "/app/frontend/src/components/WatchMode.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - Circular watch face with tick marks, BPM number in center, progress arc shows BPM level, status indicator"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Watch mode working perfectly: Circular watch face with tick marks visible, BPM display in center (shows '---' when inactive), STANDBY status indicator working, WATCH MODE header displayed correctly"

  - task: "History View"
    implemented: true
    working: true
    file: "/app/frontend/src/components/History.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - LIST view with past sessions, GRAPH view with line chart, clear history button"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - History view working perfectly: LIST view shows session data with timestamps, session names, MAX BPM (114), MAX STRESS (68%), GRAPH view displays 'FEAR EVOLUTION' with SVG chart and data points, clear history button (trash icon) visible and functional"

  - task: "Demo Mode"
    implemented: true
    working: true
    file: "/app/frontend/src/components/DemoMode.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - DEMO MODE banner, simulated data, more aggressive BPM/stress increases, faster panic mode trigger"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Demo mode working perfectly: 'DEMO MODE — SIMULATED DATA' banner visible at top, more aggressive BPM increases (reached 135 BPM, 94% stress), faster panic mode triggering, critical alert overlay working with red flash and 'CRITICAL STRESS DETECTED' text"

metadata:
  created_by: "testing_agent"
  version: "1.0"
  test_sequence: 1

test_plan:
  current_focus:
    - "Main Monitor View"
    - "Session Management"
    - "Panic Mode"
    - "Side Menu Navigation"
    - "Watch Mode"
    - "History View"
    - "Demo Mode"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
  - agent: "testing"
    message: "Starting comprehensive testing of FEAR METER biometric horror application. Will test all main features including monitor view, session management, panic mode, navigation, watch mode, history, and demo mode."